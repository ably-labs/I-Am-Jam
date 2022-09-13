export async function debugTimer(label, action: any) {
    const start = performance.now();
    await action();
    const end = performance.now();
    console.log(`${label} took ${end - start}ms`);
}