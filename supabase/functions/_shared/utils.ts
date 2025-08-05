// supabase/functions/_shared/utils.ts
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    // error가 객체가 아닐 수도 있으므로 string으로 변환
    return String(error);
}

export function extractNotionPageId(url: string): string {
    // Notion URL에서 페이지 ID를 추출하는 함수
    // 예: https://www.notion.so/nvlr/Integration-220dd4712d85801d9fe9f02f2c64a5ac?source=copy_link
    // -> 220dd4712d85801d9fe9f02f2c64a5ac
    
    try {
        // 32자리 16진수 패턴을 찾는 정규표현식 (Notion 페이지 ID 형식)
        const pageIdMatch = url.match(/([a-f0-9]{32})/i);
        
        if (pageIdMatch && pageIdMatch[1]) {
            return pageIdMatch[1];
        }
        
        // 하이픈이 포함된 UUID 형식도 처리 (일부 Notion URL에서 사용)
        const uuidMatch = url.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
        
        if (uuidMatch && uuidMatch[1]) {
            // 하이픈 제거하여 32자리 형태로 변환
            return uuidMatch[1].replace(/-/g, '');
        }
        
        throw new Error('Valid Notion page ID not found in URL');
    } catch (error) {
        throw new Error(`Failed to extract Notion page ID from URL: ${url}. ${getErrorMessage(error)}`);
    }
}
