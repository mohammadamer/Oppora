# mobile

React Native/Expo mobile client. Consumes only the public API contract; contains no business
logic, persistence access, or scraping behavior. See
[`../../docs/mobile.md`](../../docs/mobile.md) for the full boundary description.

## Running

The app fetches opportunity listings from `apps/api` (a minimal NestJS implementation of the
public opportunities API contract, currently backed by in-memory fixture data pending a
provisioned database). Start the API first, then the mobile app:

```sh
# Terminal 1 - API
cd apps/api
npm run build
npm run start      # listens on http://localhost:3000

# Terminal 2 - Mobile app
cd apps/mobile
npm install
npm run web        # run in the browser (no simulator/emulator required)
npm run android    # requires an Android emulator or device
npm run ios        # requires macOS + Xcode
```

By default the app calls `http://localhost:3000`. Override with `EXPO_PUBLIC_API_URL` when
testing against a device/emulator that can't reach `localhost` on the host machine, e.g.:

```sh
EXPO_PUBLIC_API_URL=http://192.168.1.10:3000 npm run android
```

`App.tsx` renders a simple list of opportunities (`GET /api/v1/opportunities`) with basic
Oppora branding; it contains no business logic, persistence access, or scraping behavior per
[`../../docs/mobile.md`](../../docs/mobile.md).
