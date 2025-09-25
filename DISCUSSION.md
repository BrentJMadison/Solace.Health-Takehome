1) Look into npm packages, looks like some bugs / performance issues:
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
npm warn deprecated @esbuild-kit/esm-loader@2.6.5: Merged into tsx: https://tsx.is
npm warn deprecated @esbuild-kit/core-utils@3.3.2: Merged into tsx: https://tsx.is



2) first steps, make sure app works (npm run dev) and create db and test.
- Uncommented line in .env and src/app/api/advocates/route.ts
- seeded db and db hooked up properly 
- made initation commit to add backstop


3) explore code.
Findings:
- src/app/page.tsx
    - useeffect --> Maybe convert to a hook, add error handling. Also noticing we're client side filtering
    - onChange --> Not react pattern. Need to refactor to not use DOM directly
    - type issues --> Need to utilize typescript properly
    - onClick --> not setup
    --> UI/UX --> Vanilla HTML, let's setup using MaterialUI

- src/app/api/advocates/route.ts
    - Nothing is hooked up.

4) Plan
Until now, I've used no AI. Now I'll give Claude Code instructions and audit any changes. Prompt instructions:
```
This application has some bugs and could be greatly improved. Let's start by building the API and defining the typescript interface properly.

Refactor src/app/api/advocates/route.ts
1) We want to enable server side filtering, sorting, pagination
2) We want to define the types properly. Look at src/db/seed/advocates.ts, define the type, create a backend util file where we will have other types.
3) Create an API swagger doc for this route
```