As of 07th June, 2026

# Prismic + Next.js by AT Digital

## Project Setup

### NextJS

1. Clone this repo
2. Run `npm i`
3. Run `npm outdated` to check for the packages that needs to be updated
4. Run `npm update --save` to update all the dependencies and save the new versions in package.json file
5. Or, if some updates are unstable, use `npm update {package}` to update individually

### Prismic Setup

1. Home page -> Next.js -> Connect your own web app
2. Add missing details, Select Free and click on "Create repository"
3. Pick the main language
4. Click on "Get started with Slicemachine"
5. Click on "I already have a project"
6. Open the project folder in a terminal and run `npx @slicemachine/init@latest --repository {prismicRepoName}`. Since you are in the repo, you can simply copy the command in the screen and run it. You will be asked to press any key to open the browser and login to Prismic.
7. If you are already logged in to another Prismic account, run `prismic logout`. If you do not have the Prismic CLI installed, run `npm install -global prismic-cli`. Then run the above command again.
8. You can exit the process by clicking on "I've pushed my models"

### Syncing models and creating initial content

After running `npx @slicemachine/init@latest`, in the Prismic dashboard, go to **Documents** and create the following:

**Home page**

- Type: `Page`
- Title: `Home page`
- UID / Slug: `home` ⚠️ this must be exactly `home`
- Publish the document

**Navigation**

- Type: `Main Menu`
- Title: `MainMenu`
- Add the Home page as the first menu item
- Publish the document
- Create footer manus as needed using the `Menu` type

**Settings**

- Type: `Settings`
- Fill in the missing fields
- Publish the document

## Adding Button Variants

`Primary` and `Secondary` are the defaults and are always present.

To add a new variant (e.g. `Outline`):

1. Add the name to `BUTTON_VARIANTS` in `src/lib/buttonTypes.ts`
2. Add its CSS class mapping to `VARIANT_CLASS` in `src/components/ui/StyledButton/index.tsx`
3. Add the CSS styles to `src/app/style-variables/buttons.css` (e.g. `.btn-outline { ... }`)
4. Run `npm run buttons:sync` — this writes the updated list into every slice `model.json` automatically

## Project Configuration

1. Get the exported variables from Figma and add them to the `figma-variables/` folder. `Colors`, `Radius`, `Spacing` and `Typography` feed the shared token pool; **any other collection is namespaced by its own name**, so it drives one component's CSS instead of polluting the global palette:
   - `Buttons` → `--color-button-*` and `--radius-button`, consumed by `src/app/style-variables/buttons.css`
   - `Footer` → `--color-footer-*`, consumed by `src/app/style-variables/footer.css`

   Dropping in a new collection (e.g. `Header.json` → `--color-header-*`) needs no script change — just a matching `src/app/style-variables/<component>.css` and an `@import` in `src/app/globals.css`. A trailing `-color` in a Figma variable name is redundant once namespaced and gets stripped (`bg-color` → `--color-footer-bg`).
2. Check the button types, and update the `buttonTypes.ts` file
3. Run `npm run setup` to generate `src/app/style-variables/tokens.css`, and to add all the Button types to all Prismic models.
4. Push the changes to Prismic.
5. Check and link the fonts - `--font-title` and `--font-body`: Simply ask claude to connect the fonts - `Please connect the google fonts for --font-title and --font-body. The correct fonts are defined in the tokens.css file.`
6. Deploy the project to Netlify
7. Add the content in Prismic and QA

### Running the project locally

Run `npm run dev` to start the [Project](http://localhost:1204) and the [Slice Machine](http://localhost:1203)

### Prismic Docs to refer

- [Prismic Next Image](https://prismic.io/docs/image)
- [Prismic Rich Text](https://prismic.io/docs/rich-text)
- [Route Resolver](https://prismic.io/docs/route-resolver)
- [Fetch Data](https://prismic.io/docs/fetch-data-nextjs)

## Automation steps

Once the models are pushed (Prismic Setup above) the page content is loaded into Prismic by the automation instead of by hand. Everything it writes lands as **drafts in the Migration Release** — nothing is live until someone publishes there.

### Before you start

1. Claude desktop app (Code tab), on **Opus 5 or newer at Extra-high effort** — the agent checks this first and tells you what to pick if the session is below that.
2. Skills enabled in Claude → Settings → Skills: `website-automation` and `figma-to-prismic`.
3. Figma connected in Claude → Settings → Connectors (signed in as the automation account).
4. A Prismic **machine-to-machine token** for the repo: Prismic → Settings → API & Security. You give it to the agent once; it is saved on your machine for later runs.

### Sync the design content into Prismic

1. In Claude, run `/website-automation`.
2. Pick **Design → Prismic**.
3. Fill in the form: the Figma design link, the repo name (the subdomain, e.g. `clientname` for `clientname.prismic.io`), the scope (**Everything** / **Components only** / **Content only**), the token (first time only) and, optionally, the path to this project folder so the agent can check its decisions against the code.
4. The agent checks the machine and the connections. Fix anything it flags and say "done".
5. Say "go". The agent reads the design and shows a **mapping table** — which design section becomes which slice and variation, model gaps, placeholders, fonts and their licence status, draft SEO text, blog categories, and an offer of test copies where a design grid has more cards than real content. Nothing is written until you say yes.
6. Approve. The agent creates any missing types and slices, then writes every page, menu, settings and repeatable document as a draft.
7. Check Prismic: open the repo → **Migration Release** → skim the documents (pages, settings, menus, services, blog posts).
8. **Publish the Migration Release.** Every later fix round writes new drafts — publish again each time, or the site keeps showing the old content.

If content is published while `npm run dev` is running, restart the dev server — layout data is fetched at start-up.

### Other routes behind the same door

- **Old blog import** — `/website-automation` → **Bring existing content into Prismic** → **The old website's blog**: give the old site's address, the repo and a default category; the agent shows a dry-run table of every post, you approve, it imports as drafts. Re-running later only brings across new posts.
- **Content from documents** — same menu → **A document or sheet**: new posts from a Google Doc or Word file, or copy updates to an existing (published) page or service, shown as before/after first.
- **QA a live site** — after deploy: the agent compares the live site with the Figma and writes a severity-ranked issue report.

Each route ends the same way: check the Migration Release, publish.
