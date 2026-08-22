This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Browser model setup

The original trained model is `models/conjuctiva.keras` and is tracked with Git LFS. Fetch it before conversion:

```powershell
git lfs pull
```

The browser uses TensorFlow.js TFLite support. Because Vercel deployments receive Git LFS pointers for large files, the browser model defaults to the GitHub LFS media URL. You can override it with `NEXT_PUBLIC_MODEL_URL` when deploying from another asset host. Install TensorFlow in a Python environment, then run:

```powershell
pip install tensorflow
.\scripts\convert-model.ps1
```

The Keras model declares an input shape of `224x224x3` float32 and has no embedded normalization layer. Its output is a single sigmoid value. The app therefore keeps preprocessing isolated and displays the raw model output until the training preprocessing and output meaning are confirmed by the ML team. The original `models/conjuctiva.keras` remains unchanged.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

