export async function startWatching(owner, repo, callback) {
  throw new Error('startWatching not implemented');
}
export async function stopWatching() {
  throw new Error('stopWatching not implemented');
}

export const liveReload = {
  startWatching,
  stopWatching
};