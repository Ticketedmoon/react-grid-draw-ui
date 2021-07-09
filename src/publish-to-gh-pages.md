### Quick Guide when publishing the Library Demo
1. Run ``npm run build-prod-demo-gh-page``
2. Open `dist/index.html`
3. Rename line 9 with content: ``<script src="dist/index.js"></script>``
   to ``<script src="./index.js"></script>``