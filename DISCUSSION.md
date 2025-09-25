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


#1:
```
This application has some bugs and could be greatly improved. Let's start by building the API and defining the typescript interface properly.

Refactor src/app/api/advocates/route.ts
1) We want to enable server side filtering, sorting, pagination
2) We want to define the types properly. Look at src/db/seed/advocates.ts, define the type, create a backend util file where we will have other types.
3) Create an API swagger doc for this route
```
Result: 1520441d247dd5da21f61c57f0dd4b0b2e1e4bd6


#2:
```
Read @docs/api/advocates.swagger.yaml and @src/app/page.tsx 
--> Let's clean up the frontend of this application

1) Create a data fetching hook to use /api/advocates and support sorting, filtering, pagination according to swagger docs
2) Utilize this hook on the frontend route to load initial data with pagesize 10 on page 1
3) Refactor onchange to use proper react patterns. This is manipulating the DOM directly currently. Properly utilize state. Add debounce for searching using lodash and data fetching hook
4) Let's utility types properly from @lib/types --> We can create new types if needed
5) onclick no longer neededd as we'll fetch with debounce
6) add proper keys so react can re-render efficiently
```
Result: 62a19c0325a0cd7197edb4e670634410addd662c -- Looking pretty good now!

#3:
```
Read @docs/api/advocates.swagger.yaml and @src/app/page.tsx 
--> Let's improve the UI/UX of this application and use MaterialUI 5 and MUI x data grid to allow for search/sort/filter on all columns.
Brand colors: #1d4238 (Green) and #ffffff (white) logo is: https://cdn.prod.website-files.com/632a21d0ec93a082b11988a0/666868fe2677eab531bd589e_Solace.svg


Let's create a simple and modern display with a title and description of what this application can do.

1) make initial state for filters setFilters and initial state for pagination/sorting/filtering
2) handleClearFilters is clearing things but it should refetch with original state properly
3) Speciality chips are getting cut off on next line. Let's make these smaller
4) fix <img lint warning
5) refactor to use new grid system in MUI latest version
<Grid container spacing={2}>
  <Grid size={8}>
    <Item>size=8</Item>
  </Grid>

```
Also had some other tweak prompts to get this correct.