// supabase/functions/_shared/utils.ts
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    // error가 객체가 아닐 수도 있으므로 string으로 변환
    return String(error);
}
