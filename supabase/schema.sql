-- Supabase 데이터베이스 스키마
-- 이 SQL을 Supabase SQL Editor에서 실행하세요

-- 테스트 정보 테이블
CREATE TABLE IF NOT EXISTS tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    description TEXT,
    thumbnail_icon VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    category_name VARCHAR(100),
    category_icon VARCHAR(255),
    duration VARCHAR(20),
    questions JSONB,
    result_types JSONB,
    is_active BOOLEAN DEFAULT true,
    is_new BOOLEAN DEFAULT false,
    is_hot BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 테스트 통계 테이블
CREATE TABLE IF NOT EXISTS test_statistics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    total_participants INTEGER DEFAULT 0,
    result_distribution JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_id)
);

-- 사용자 프로필 확장 테이블
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 테스트 결과 테이블
CREATE TABLE IF NOT EXISTS test_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    result_type VARCHAR(50) NOT NULL,
    scores JSONB,
    answers JSONB,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 테스트 결과 공유 테이블
CREATE TABLE IF NOT EXISTS shared_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    result_id UUID REFERENCES test_results(id) ON DELETE CASCADE,
    share_code VARCHAR(10) UNIQUE NOT NULL,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
);

-- 인덱스 생성
CREATE INDEX idx_test_results_user_id ON test_results(user_id);
CREATE INDEX idx_test_results_test_id ON test_results(test_id);
CREATE INDEX idx_test_results_completed_at ON test_results(completed_at DESC);
CREATE INDEX idx_test_statistics_participants ON test_statistics(total_participants DESC);
CREATE INDEX idx_shared_results_share_code ON shared_results(share_code);

-- Row Level Security (RLS) 정책
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_results ENABLE ROW LEVEL SECURITY;

-- 사용자 프로필 정책
CREATE POLICY "사용자는 자신의 프로필을 볼 수 있음" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "사용자는 자신의 프로필을 수정할 수 있음" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "사용자는 자신의 프로필을 생성할 수 있음" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 테스트 결과 정책
CREATE POLICY "사용자는 자신의 결과를 볼 수 있음" ON test_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 결과를 저장할 수 있음" ON test_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "공개 결과는 모두가 볼 수 있음" ON test_results
    FOR SELECT USING (is_public = true);

-- 공유 결과 정책
CREATE POLICY "공유 링크는 모두가 볼 수 있음" ON shared_results
    FOR SELECT USING (expires_at > NOW());

CREATE POLICY "사용자는 자신의 결과를 공유할 수 있음" ON shared_results
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM test_results 
            WHERE test_results.id = shared_results.result_id 
            AND test_results.user_id = auth.uid()
        )
    );

-- 함수: 테스트 통계 증가
CREATE OR REPLACE FUNCTION increment_test_stats(
    test_id_param UUID,
    result_type_param VARCHAR(50)
)
RETURNS VOID AS $$
BEGIN
    -- 전체 참여자 수 증가
    UPDATE test_statistics
    SET 
        total_participants = total_participants + 1,
        updated_at = NOW()
    WHERE test_id = test_id_param;
    
    -- 결과 타입별 분포 업데이트
    UPDATE test_statistics
    SET 
        result_distribution = 
            CASE 
                WHEN result_distribution ? result_type_param THEN
                    jsonb_set(
                        result_distribution,
                        ARRAY[result_type_param],
                        to_jsonb((result_distribution->result_type_param)::int + 1)
                    )
                ELSE
                    result_distribution || jsonb_build_object(result_type_param, 1)
            END,
        updated_at = NOW()
    WHERE test_id = test_id_param;
END;
$$ LANGUAGE plpgsql;

-- 함수: 공유 코드 생성
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS VARCHAR(10) AS $$
DECLARE
    chars VARCHAR(62) := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    result VARCHAR(10) := '';
    i INTEGER;
BEGIN
    FOR i IN 1..10 LOOP
        result := result || substr(chars, floor(random() * 62 + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 트리거: 사용자 프로필 자동 생성
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- 트리거: 테스트 통계 자동 생성
CREATE OR REPLACE FUNCTION create_test_statistics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO test_statistics (test_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_test_created
    AFTER INSERT ON tests
    FOR EACH ROW EXECUTE FUNCTION create_test_statistics();

-- 트리거: 업데이트 시간 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tests_updated_at
    BEFORE UPDATE ON tests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_test_statistics_updated_at
    BEFORE UPDATE ON test_statistics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 초기 테스트 데이터 삽입
INSERT INTO tests (test_id, title, subtitle, category, category_name, category_icon, thumbnail_icon, duration, is_active, is_new, is_hot, questions, result_types)
VALUES 
    ('egen-teto', '에겐남·테토녀 테스트', '나는 감성적인 에겐? 주도적인 테토?', 'personality', '성격유형', 'assets/icons/mask.svg', 'assets/icons/test-brain.svg', '3분', true, true, true, 
     '[
        {
            "question": "친구가 힘들어할 때 나는",
            "answers": [
                { "text": "말없이 옆에 있어주며 위로한다", "type": "E" },
                { "text": "구체적인 해결책을 제시한다", "type": "T" }
            ]
        },
        {
            "question": "갈등 상황에서 나는",
            "answers": [
                { "text": "상대방의 마음을 먼저 이해하려 한다", "type": "E" },
                { "text": "논리적으로 문제를 분석한다", "type": "T" }
            ]
        },
        {
            "question": "팀 프로젝트에서 나는",
            "answers": [
                { "text": "분위기를 맞춰가며 조화를 추구한다", "type": "E" },
                { "text": "효율적인 역할 분담을 제안한다", "type": "T" }
            ]
        },
        {
            "question": "연인이 화났을 때 나는",
            "answers": [
                { "text": "일단 달래고 감정을 풀어준다", "type": "E" },
                { "text": "왜 화났는지 이유를 물어본다", "type": "T" }
            ]
        },
        {
            "question": "중요한 결정을 내릴 때 나는",
            "answers": [
                { "text": "직감과 감정을 따른다", "type": "E" },
                { "text": "장단점을 분석해서 결정한다", "type": "T" }
            ]
        },
        {
            "question": "친구가 실수했을 때 나는",
            "answers": [
                { "text": "괜찮다며 위로해준다", "type": "E" },
                { "text": "다음에 조심하라고 조언한다", "type": "T" }
            ]
        },
        {
            "question": "일이 계획대로 안 될 때 나는",
            "answers": [
                { "text": "스트레스를 받으며 감정적으로 반응한다", "type": "E" },
                { "text": "대안을 찾아서 문제를 해결한다", "type": "T" }
            ]
        },
        {
            "question": "부당한 상황을 목격했을 때 나는",
            "answers": [
                { "text": "감정적으로 공감하며 안타까워한다", "type": "E" },
                { "text": "바로 나서서 문제를 지적한다", "type": "T" }
            ]
        },
        {
            "question": "좋아하는 사람에게 고백할 때 나는",
            "answers": [
                { "text": "로맨틱한 분위기를 만들어서 고백한다", "type": "E" },
                { "text": "솔직하고 직설적으로 말한다", "type": "T" }
            ]
        },
        {
            "question": "친구들과 의견이 다를 때 나는",
            "answers": [
                { "text": "분위기를 해치지 않으려고 맞춰준다", "type": "E" },
                { "text": "내 의견을 명확하게 표현한다", "type": "T" }
            ]
        },
        {
            "question": "상대방이 속상해할 때 나는",
            "answers": [
                { "text": "같이 속상해하며 공감해준다", "type": "E" },
                { "text": "냉정하게 상황을 분석해준다", "type": "T" }
            ]
        },
        {
            "question": "리더 역할을 맡게 되었을 때 나는",
            "answers": [
                { "text": "팀원들의 의견을 먼저 듣는다", "type": "E" },
                { "text": "목표를 정하고 계획을 세운다", "type": "T" }
            ]
        }
    ]'::jsonb,
    '{
        "E남": {
            "title": "에겐남",
            "emoji": "💝",
            "subtitle": "차분하고 섬세한 감성의 소유자",
            "description": "차분하고 섬세한 감성이 돋보이는 당신! 주변을 다정하게 챙기고, 감정 공감이 탁월한 유형이에요."
        },
        "E녀": {
            "title": "에겐녀", 
            "emoji": "🌺",
            "subtitle": "감정에 민감하고 배려심 깊은 유형",
            "description": "감정에 민감하고 공기의 흐름을 잘 읽어요. 섬세한 배려와 부드러운 소통이 장점입니다."
        },
        "T남": {
            "title": "테토남",
            "emoji": "🔥", 
            "subtitle": "당당하고 리더십이 넘치는 유형",
            "description": "당당하고 리더십이 넘치는 유형! 주도적인 결정과 직설적인 표현으로 듬직한 신뢰감을 줍니다."
        },
        "T녀": {
            "title": "테토녀",
            "emoji": "⚡",
            "subtitle": "독립적이고 솔직한 추진형", 
            "description": "독립적이고 솔직한 추진형! 자기주관이 강하고 사회적 도전을 즐기는 스타일입니다."
        }
    }'::jsonb),
    ('mbti-simple', 'MBTI 간단 테스트', '나의 성격 유형은 무엇일까?', 'personality', '성격유형', 'assets/icons/mask.svg', 'assets/icons/test-palette.svg', '5분', true, false, false, 
     '[]'::jsonb,
     '{}'::jsonb),
    ('love-style', '연애 스타일 테스트', '나의 연애 패턴을 알아보자', 'love', '연애/궁합', 'assets/icons/heart.svg', 'assets/icons/test-heart.svg', '4분', true, false, true,
     '[]'::jsonb,
     '{}'::jsonb),
    ('stress-test', '스트레스 지수 테스트', '나의 스트레스 수준은?', 'psychology', '심리', 'assets/icons/puzzle.svg', 'assets/icons/test-paw.svg', '3분', true, false, false,
     '[]'::jsonb,
     '{}'::jsonb)
ON CONFLICT (test_id) DO NOTHING;