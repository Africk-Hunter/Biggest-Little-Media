# Admin panel — one-time account setup

Code is done; these are the account-side steps only a project owner can do (they need real logins). Nothing here can be done by an agent — it all happens in web consoles with your credentials.

## 1. Firebase (Auth + Firestore)

1. Go to the [Firebase console](https://console.firebase.google.com/) → Add project.
2. **Build > Authentication** → Get started → enable the **Email/Password** provider.
3. **Build > Authentication > Users** → Add user → create BLM's admin login(s) manually. There is no public signup form by design.
4. **Build > Firestore Database** → Create database → start in production mode (any region).
5. Deploy the security rules at the repo root:
   ```
   npm i -g firebase-tools   # one-time
   firebase login
   firebase init firestore   # link this project
   firebase deploy --only firestore:rules
   ```
   This pushes `firestore.rules` (public read, signed-in write on the `videos` collection).
6. **Project settings (gear icon) > General > Your apps** → Add app → Web. Copy the config values into `.env.local` (copy `.env.example` → `.env.local` first if you haven't):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`

No credit card is required for any of the above — Auth and Firestore are on the free Spark plan.

## 2. Cloudinary (video storage/hosting)

No credit card required for Cloudinary's free plan (25 credits/month — storage + bandwidth + transformations combined, generous for a portfolio site).

1. Sign up at [cloudinary.com](https://cloudinary.com) (email, Google, or GitHub — no card).
2. Dashboard home shows your **Cloud name** → copy it into `VITE_CLOUDINARY_CLOUD_NAME`.
3. **Settings (gear icon) > Upload > Upload presets** → Add upload preset:
   - Set **Signing Mode** to **Unsigned** (lets the browser upload directly with no backend).
   - Set **Folder** to `videos` (keeps uploads organized, matches what the app expects).
   - Under **Upload Manipulations / Restrictions**, set a max file size (e.g. 100MB) as a backstop.
   - Under **Upload Manipulations**, add an **Incoming Transformation** of `c_limit,w_1920,h_1920`. This caps the stored master at ~1080p-equivalent (longer edge ≤1920px, no upscaling of smaller sources) so an oversized upload (e.g. a 4K export) doesn't inflate storage or become the base every delivery-time transform has to downscale from. The app's own `w_` transforms (see `src/lib/cloudinary.ts`) still downsize further per placement on top of this.
   - Copy the preset name into `VITE_CLOUDINARY_UPLOAD_PRESET`.

**Security tradeoff, on purpose:** unsigned uploads aren't authenticated by Cloudinary itself — the preset name ships in the site's JS bundle, so technically anyone who finds it could upload through it. Our own admin UI still requires a Firebase login to reach the upload form, but that's an app-level gate, not a Cloudinary-level one. This avoids needing a custom backend (which is what pulled in the Cloudflare Worker, then Firebase Storage/Blaze, before landing here) — acceptable for a small single-tenant portfolio site, but flagging it explicitly rather than leaving it implicit.

One consequence: Cloudinary's unsigned API also can't delete files (deletion requires a signed request). The admin panel's "Delete" button removes the video from the site (Firestore); the underlying file stays in Cloudinary until removed manually from the **Media Library** there. Not automatic — a manual cleanup step if storage ever gets close to the free-tier limit.

## 3. EmailJS (contact form)

No credit card required — EmailJS's free plan covers 200 emails/month, plenty for a contact form.

1. Sign up at [emailjs.com](https://www.emailjs.com).
2. **Email Services** → Add New Service → connect the Gmail account that should receive messages (e.g. `biggestlittlemedia@gmail.com`). Copy the **Service ID** into `VITE_EMAILJS_SERVICE_ID`.
3. **Email Templates** → Create New Template. Use `{{name}}`, `{{email}}`, `{{phone}}`, and `{{notes}}` as variables in the template body — these match the contact form's field names. Copy the **Template ID** into `VITE_EMAILJS_TEMPLATE_ID`.
4. **Account > General** → copy the **Public Key** into `VITE_EMAILJS_PUBLIC_KEY`.

**Security note:** the public key ships in the site's JS bundle by design (same tradeoff as the Cloudinary unsigned preset) — EmailJS's client-side SDK is built to work this way. To prevent abuse, restrict allowed domains under **Account > Security > Allowed origins**.

## 4. Run it

```
npm install
npm run dev
```

Visit `/admin/login`, sign in with the account created in step 1.3, and upload a clip. It uploads straight from the browser to Cloudinary — no backend to deploy.
