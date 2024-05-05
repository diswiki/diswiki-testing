function truncate(str: string, n: number): string {
    return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
};
function slugify(str: string): string {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export {
    truncate,
    slugify
}