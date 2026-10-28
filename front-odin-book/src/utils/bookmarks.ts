export function getBookmarkedIds(userId: string): string[] {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(`echo_bookmarks_${userId}`) || localStorage.getItem(`odin_bookmarks_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isPostBookmarked(userId: string, postId: string): boolean {
  if (!userId || !postId) return false;
  const bookmarks = getBookmarkedIds(userId);
  return bookmarks.includes(postId);
}

export function togglePostBookmark(userId: string, postId: string): boolean {
  if (!userId || !postId) return false;
  const bookmarks = getBookmarkedIds(userId);
  const exists = bookmarks.includes(postId);
  const updated = exists
    ? bookmarks.filter((id) => id !== postId)
    : [...bookmarks, postId];

  try {
    localStorage.setItem(`echo_bookmarks_${userId}`, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save bookmark:', e);
  }

  return !exists;
}
