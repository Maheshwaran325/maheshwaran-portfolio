/** Supplied by the `changelog` plugin in vite.config.ts, which reads git. */
declare module 'virtual:changelog' {
  export interface Commit {
    /** Abbreviated hash, as `git log %h` prints it. */
    sha: string;
    /** Committer date, `YYYY-MM-DD`. */
    date: string;
    /** First line of the commit message. */
    subject: string;
  }
  export const COMMITS: Commit[];
}
