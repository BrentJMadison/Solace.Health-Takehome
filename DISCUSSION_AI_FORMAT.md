# Project Analysis and Improvement Plan

## Initial Findings

### 1. NPM Package Issues
Discovered deprecated packages with bugs/performance issues

### 2. First Steps - App Setup & Database
- ✅ Uncommented line in `.env` and `src/app/api/advocates/route.ts`
- ✅ Seeded database and confirmed proper connection
- ✅ Made initial commit to add backstop
- ✅ Verified app runs with `npm run dev`

### 3. Code Exploration

#### `src/app/page.tsx` Issues:
- **useEffect** → Convert to custom hook, add error handling. Currently doing client-side filtering
- **onChange** → Not following React patterns. Refactor to avoid direct DOM manipulation  
- **Type issues** → Need to properly utilize TypeScript
- **onClick** → Not set up
- **UI/UX** → Using vanilla HTML, should implement MaterialUI

#### `src/app/api/advocates/route.ts` Issues:
- **Nothing is hooked up**

## 4. Improvement Plan

*Until now, I've used no AI. Now I'll give Claude Code instructions and audit any changes.*


## 5. Future Improvements
- **Full name searching** / fuzzy searching support
- **API filtering** - Return valid filters with subset of data
- **Database indexes** for faster data retrieval  
- **Skeleton loading** implementation
- **Database normalization** - Make city, degree, specialty their own tables

### AI Suggestions (Agreed):
- **Inefficient DB queries** (example: `COUNT(*)`)
- **Input validation** for API (can use Zod)
- **Raw SQL issues** in backend route for specialty (would be fixed with proper tables)
- **URL state management** - Filters aren't reflected in URL
- **Mobile experience** improvements