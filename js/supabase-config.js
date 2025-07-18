// Supabase 설정
// 주의: 실제 프로덕션에서는 환경 변수를 사용하세요
const SUPABASE_URL = 'https://rtphcgudhfeveihxwban.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0cGhjZ3VkaGZldmVpaHh3YmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTE5MjgsImV4cCI6MjA2ODQyNzkyOH0.3PwinIyWEI26lh_DAzO88cWtGY2zORvWXYdnnzGJNqE';

// Supabase 클라이언트 초기화
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 인증 상태 관리
let currentUser = null;

// 인증 상태 변경 리스너
supabase.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    updateAuthUI();
});

// UI 업데이트 함수
function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    
    if (currentUser) {
        // 로그인 상태
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'flex';
            const userEmail = document.getElementById('userEmail');
            if (userEmail) userEmail.textContent = currentUser.email;
        }
    } else {
        // 로그아웃 상태
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// 로그인 함수
async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('로그인 오류:', error);
        return { success: false, error: error.message };
    }
}

// 회원가입 함수
async function signUp(email, password, metadata = {}) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('회원가입 오류:', error);
        return { success: false, error: error.message };
    }
}

// 로그아웃 함수
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        return { success: true };
    } catch (error) {
        console.error('로그아웃 오류:', error);
        return { success: false, error: error.message };
    }
}

// 테스트 결과 저장
async function saveTestResult(testId, result, scores) {
    if (!currentUser) {
        console.warn('로그인이 필요합니다');
        return { success: false, error: '로그인이 필요합니다' };
    }
    
    try {
        const { data, error } = await supabase
            .from('test_results')
            .insert({
                user_id: currentUser.id,
                test_id: testId,
                result_type: result,
                scores: scores,
                completed_at: new Date().toISOString()
            });
        
        if (error) throw error;
        
        // 통계 업데이트
        await updateTestStatistics(testId, result);
        
        return { success: true, data };
    } catch (error) {
        console.error('결과 저장 오류:', error);
        return { success: false, error: error.message };
    }
}

// 테스트 통계 업데이트
async function updateTestStatistics(testId, resultType) {
    try {
        // RPC 함수 호출로 통계 업데이트
        const { error } = await supabase
            .rpc('increment_test_stats', {
                test_id_param: testId,
                result_type_param: resultType
            });
        
        if (error) throw error;
    } catch (error) {
        console.error('통계 업데이트 오류:', error);
    }
}

// 사용자 테스트 기록 가져오기
async function getUserTestHistory() {
    if (!currentUser) return { success: false, error: '로그인이 필요합니다' };
    
    try {
        const { data, error } = await supabase
            .from('test_results')
            .select('*, tests(*)')
            .eq('user_id', currentUser.id)
            .order('completed_at', { ascending: false });
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('기록 조회 오류:', error);
        return { success: false, error: error.message };
    }
}

// 테스트 통계 가져오기
async function getTestStatistics(testId) {
    try {
        const { data, error } = await supabase
            .from('test_statistics')
            .select('*')
            .eq('test_id', testId)
            .single();
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('통계 조회 오류:', error);
        return { success: false, error: error.message };
    }
}

// 실시간 통계 구독
function subscribeToTestStats(testId, callback) {
    const subscription = supabase
        .channel(`test_stats:${testId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'test_statistics',
                filter: `test_id=eq.${testId}`
            },
            (payload) => {
                callback(payload.new);
            }
        )
        .subscribe();
    
    return subscription;
}

// 모든 테스트 가져오기
async function getAllTests() {
    try {
        const { data, error } = await supabase
            .from('tests')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('테스트 목록 조회 오류:', error);
        return { success: false, error: error.message };
    }
}

// 인기 테스트 가져오기
async function getPopularTests(limit = 5) {
    try {
        const { data, error } = await supabase
            .from('test_statistics')
            .select('*, tests(*)')
            .order('total_participants', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        
        return { success: true, data: data.map(item => item.tests) };
    } catch (error) {
        console.error('인기 테스트 조회 오류:', error);
        return { success: false, error: error.message };
    }
}

// Export functions
window.supabaseAuth = {
    signIn,
    signUp,
    signOut,
    getCurrentUser: () => currentUser,
    onAuthStateChange: (callback) => supabase.auth.onAuthStateChange(callback)
};

window.supabaseData = {
    saveTestResult,
    getUserTestHistory,
    getTestStatistics,
    getAllTests,
    getPopularTests,
    subscribeToTestStats
};