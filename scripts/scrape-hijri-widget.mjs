name: Update Hijri Calendar Widget (UK)

on:
  schedule:
    - cron: "17 2 * * *"
  workflow_dispatch: {}

permissions:
  contents: write

jobs:
  scrape-and-commit:
    runs-on: ubuntu-latest
    timeout-minutes: 20

    env:
      FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"

    steps:
      - name: Checkout
        uses: actions/checkout@v5

      - name: Setup Node
        uses: actions/setup-node@v5
        with:
          node-version: "22"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run scraper
        run: npm run scrape:hijri

      - name: Commit & push if changed
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"

          git add public/widgets/hijri-calendar-uk.html

          if git diff --cached --quiet; then
            echo "No changes to commit."
            exit 0
          fi

          git commit -m "Update Hijri calendar widget (UK)"
          git push
