export async function getAuthToken() {
  throw new Error('getAuthToken not implemented');
}
export async function initiateOAuthLogin() {
  throw new Error('initiateOAuthLogin not implemented');
}
export async function logout() {
  throw new Error('logout not implemented');
}
export async function getRepoStructure(owner, repo) {
  throw new Error('getRepoStructure not implemented');
}
export async function readFile(owner, repo, path) {
  throw new Error('readFile not implemented');
}
export async function writeFile(owner, repo, path, content, message, sha) {
  throw new Error('writeFile not implemented');
}
export async function deleteFile(owner, repo, path, message, sha) {
  throw new Error('deleteFile not implemented');
}
export async function getBranchInfo(owner, repo, branch = 'main') {
  throw new Error('getBranchInfo not implemented');
}
export async function getCommitHistory(owner, repo, path, limit = 20) {
  throw new Error('getCommitHistory not implemented');
}
export async function compareCommits(owner, repo, base, head) {
  throw new Error('compareCommits not implemented');
}
export async function getUser() {
  throw new Error('getUser not implemented');
}
