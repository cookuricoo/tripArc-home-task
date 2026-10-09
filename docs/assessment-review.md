# Assessment review

Reviewed against the TripArc QA Lead mobile automation brief. The required bar is met in this repository. What is still open is execution evidence (a public GitHub repo, a real iOS session, Sauce Labs, hosted CI) and a few places where the framework is heavier or more fragile than the brief needs.

The same four specs can run on Android and iOS today. Platform differences stay in locator maps, fixtures, capabilities, and two page/helper branches. Specs do not mention a platform.

## Requirements coverage

| Requirement | Status | Where |
| --- | --- | --- |
| Appium + WebdriverIO + TypeScript against an Android emulator | Covered | `config/wdio.local.ts`, `npm run test:android` |
| Launch, catalog, product, cart, checkout across multiple screens | Covered | `tests/specs/purchase.spec.ts` through confirmation |
| At least one mobile-specific interaction | Covered | Bounded scroll in `DeviceHelper.scrollTo`; background and reactivate in `tests/specs/lifecycle.spec.ts` |
| Same business test for Android and iOS, with one concrete platform abstraction | Covered in structure, not executed on iOS | `pair()` in `src/locators/strategies.ts`; cart tab example below |
| Synchronization without hard-coded sleeps | Covered | `waitForDisplayed`, `waitUntil` on badge, quantity, and subtotal. Mocha retries are 0 |
| One negative or edge case that needs a real assertion | Covered | Shipping validation in `tests/specs/checkout-validation.spec.ts`; cart quantity/subtotal in `tests/specs/cart.spec.ts` |
| README: run, structure, locators, Android/iOS, cloud, flakiness | Covered | `README.md` |
| Public GitHub repository (submission) | Missing | Local git only. `docs/validation.md` says publication is still pending |
| Cloud, parallel, failure artifacts, CI, API setup, reporting | Present as optional extras | Cloud and hosted CI have not been executed |

Android device evidence is recorded in `docs/validation.md` (serial suite, two-emulator parallel suite, three stability runs, intentional failure artifacts). iOS locators are source-inspected against [my-demo-app-ios 2.3.0](https://github.com/saucelabs/my-demo-app-ios/tree/2.3.0) and have no runtime pass.

## Concrete platform abstraction already in the suite

Business specs call `openCart()`. The page resolves one locator per platform:

```10:11:src/locators/screens.ts
export const navigation = {
  cart: pair(id('cartIV'), '~Cart-tab-item'),
```

`LocatorHelper.resolve` picks `android` or `ios` from `browser.isAndroid`. Android uses the `cartIV` resource ID. iOS uses the `Cart-tab-item` accessibility ID from the tab bar. The spec stays the same.

Three other differences are already isolated the same way:

- Product identity. Android expects `Sauce Labs Backpack`. iOS English copy is `Sauce Labs Backpack - Black`. `FixtureHelper.product()` selects the row in `src/data/fixtures.ts`. Both are $29.99, and both apps add $5.99 delivery.
- Shipping validation behavior. Android renders `fullNameErrorTV` inline. iOS presents an alert titled `Validation Error!` whose message is `Please provide your full name.` (`ShippingAddressViewController.swift` on tag 2.3.0). `ShippingPage` scrolls back to the inline error on Android and dismisses the alert on iOS. The spec still asserts the same message and that checkout did not advance.
- Capabilities. `cloudCapabilities()` switches `UiAutomator2` / `XCUITest` and the Sauce Labs device variables. Local Android adds `udid`, `systemPort`, and `fullReset`.

## What is missing

### Submission evidence

- No public GitHub remote yet. The brief asks for a public repository link, not a zip or a private repo.
- Sauce Labs Android and iOS configs exist (`config/wdio.cloud-android.ts`, `config/wdio.cloud-ios.ts`) and have not been run. Data center, device names, and IPA re-signing still have to be confirmed in the account.
- GitHub Actions workflows exist and have not run on GitHub.

### iOS cannot run from the current scripts

`npm run test:android` is the only local device command. There is no `test:ios` script, no local iOS WDIO config, and `scripts/register-driver.ts` installs only `uiautomator2`. `appium-xcuitest-driver` is not a dependency.

The pinned file in `config/apps.json` is `SauceLabs-Demo-App.ipa` from the [2.3.0 iOS release](https://github.com/saucelabs/my-demo-app-ios/releases/download/2.3.0/SauceLabs-Demo-App.ipa). That IPA is a device build (`com.saucelabs.mydemo.app.ios`). It is the right artifact for Sauce Labs Real Device Cloud or a signed device. It is not a Simulator `.app`. `simctl install` cannot use it.

Building the simulator app from source needs Xcode and the credentials in `Config/Local.xcconfig` (`SAUCE_MOBILE_BETA_TOKEN`, `BACKTRACE_UNIVERSE`, `BACKTRACE_TOKEN`). Those tokens are for the demo SDKs inside the app, not for Appium.

### iOS locators that will likely fail on the first real session

These are written from storyboards and Swift, not from an XCUITest accessibility tree. Expect to correct them from the first failure's page source, which `ArtifactHelper` already saves.

- Catalog open taps an iOS static text (`iosText(name)`). The app sets `productNameLbl.accessibilityLabel`. On Android, only the product image has a click listener, which already broke the first purchase run. The iOS cell may behave the same way: the label is visible and the cell is what navigates. If the tap does nothing, click the cell that contains that label.
- Cart, review, and badge selectors use the first table cell and footer XPath (`screens.ts`). That matches the one-product scenarios. A second product in the cart will read the wrong row. Android resource IDs have the same one-row assumption.
- Shipping and payment fields are found by placeholder `value` (`Rebecca Winter`, `3258 1265 7568 7896`, and so on). That works once, on an empty field. After `setValue`, the placeholder is gone, so the same locator cannot find the field again. Do not reuse those locators for edit or clear flows.
- iOS plus/minus buttons are matched by image-derived names (`AddPlus Icons`, `SubtractMinus Icons`). Confirm those `name` values in the tree; they may be the image name rather than the control name.
- Do not set `autoAcceptAlerts` or `autoDismissAlerts` on iOS. The validation scenario must read the alert before `ShippingPage.dismissValidation()` taps OK.

### Operational gaps on this Mac

Java and the Android SDK live under ignored `.tools/`. `scripts/local-env.sh` exports them for the current shell only. Cursor tasks and new terminals do not source it, which is why `npm run report` failed with "Unable to locate a Java Runtime" and why `npm run test:android` failed when `emulator-5554` was not booted. A machine with a normal `JAVA_HOME` and `ANDROID_HOME` does not need the script. This checkout does, for Allure, `adb`, and the emulator.

`npm run doctor` checks that some device is online. It does not check that the device is `emulator-5554` or that `sys.boot_completed` is `1`.

## How to run the iOS app with the same specs

Keep `tests/specs/*` unchanged. Add a session that reports `browser.isIOS`, and the existing locator map, product fixture, shipping branch, and lifecycle bundle id (`com.saucelabs.mydemo.app.ios` in `DeviceHelper`) take over.

### Path A — Sauce Labs Real Device Cloud, using the official IPA

This matches the cloud configs and avoids a local WDA/signing setup. Sauce Labs runs XCUITest on a real device in the account data center.

1. `npm run apps:download -- ios` (checksum is already pinned).
2. Put `SAUCE_USERNAME`, `SAUCE_ACCESS_KEY`, `SAUCE_REGION`, `SAUCE_IOS_DEVICE`, and `SAUCE_IOS_OS` in `.env`. `SAUCE_REGION` is `us-west-1`, `us-east-4`, or `eu-central-1`. Pick a device/OS pair the account actually has.
3. `npm run cloud:upload -- ios` and copy the returned `storage:<id>` into `SAUCE_IOS_APP`.
4. `npm run test:cloud:ios`.
5. On the first failure, replace the offending iOS string in `src/locators/screens.ts` using the saved page source. Re-run one spec with `npm run test:cloud:ios -- --spec tests/specs/cart.spec.ts` before the full suite.

Leave `autoGrantPermissions` as Android-only, which `cloudCapabilities()` already does. The iOS validation alert must stay visible.

### Path B — local Simulator

Use this when the walkthrough should show a local iOS session. Do not point Appium at the IPA.

1. Clone [saucelabs/my-demo-app-ios](https://github.com/saucelabs/my-demo-app-ios) at tag `2.3.0`.
2. Copy `Config/Local.xcconfig.example` to `Config/Local.xcconfig` and fill the three SDK keys the README requires, then build the `My Demo App` scheme for a simulator. The product is a `.app`, not the release IPA.
3. Add `appium-xcuitest-driver` and register it the same way `scripts/register-driver.ts` registers UiAutomator2, with the same `APPIUM_HOME`.
4. Add a local config beside `config/wdio.local.ts`: `platformName: iOS`, `appium:automationName: XCUITest`, `appium:app` set to the built `.app`, `appium:bundleId: com.saucelabs.mydemo.app.ios`, `appium:udid` of the booted simulator, `appium:noReset: false`. Skip `fullReset` until a run shows it is required; iOS reinstalls are slower and WDA startup dominates the first session.
5. Boot the simulator, then run the same spec files. `FixtureHelper` and `LocatorHelper` need no spec changes.

First WDA build needs Xcode and a few minutes. After that, start with `cart.spec.ts`. It exercises the catalog tap, the cart row, and the quantity wait, which are the fragile iOS selectors, and it never opens the validation alert.

## Improvements worth making

Ordered by how much they change the interview story. None of these are required to claim the brief is implemented.

1. **Publish the repo and attach one real cloud or CI run.** The code claims those paths. `docs/validation.md` correctly says they are pending. An interviewer will ask which runs actually happened. Either execute `test:cloud:ios` or say plainly that iOS is source-level only.

2. **Fix iOS selectors from a device tree before calling them done.** The cart tab `pair()` is a clean example and is likely right. The cell XPath and placeholder fields are the ones that will waste a live demo. One recorded cart spec is enough to promote those strings from "source audit" to "verified."

3. **Scroll only when the control is off-screen.** `BasePage.fill` always calls `scrollTo`. On a short form that hides the next field under the keyboard, especially on iOS, where `dismissKeyboard` sometimes leaves the keyboard up on purpose. `scrollTo` already returns immediately when the element is displayed. Call it only in that case, or after a failed `waitForDisplayed`.

4. **Scope a cart row by product name before adding any multi-product test.** Both platforms read "the first cell." The quantity wait is correct for one line. It will assert the wrong price as soon as a second product exists.

5. **Make the local toolchain visible to npm scripts on this machine.** `report` and `doctor` spawn Java and `adb` with whatever `PATH` the parent process has. A one-line prefix that exports `.tools/java` and `.tools/android-sdk` when those directories exist would stop the "no Java runtime" failure in Cursor tasks. People who already have system JDKs and SDKs would be unaffected if the prefix only fills empty variables.

6. **Teach `doctor` to name the expected device.** "A device is connected" is weaker than "`emulator-5554` is `device` and boot completed." The suite's default UDID is `emulator-5554`. The last local failure was exactly that mismatch: Appium was up, and nothing was attached.

## Ways to simplify

The brief says this is not a complete framework and asks for about two hours of automation, not environment setup. This repo also has parallel execution, Sauce Labs upload, three GitHub workflows, Allure, an API-setup interface, architecture lint, and a stability runner. That is useful evidence. It is also more surface than a walkthrough can cover. Simplify by refusing new layers, not by merging the page objects.

**Keep**

- Eight page objects. They match eight screens, and the purchase spec reads as the business flow.
- The locator map plus `pair()`. That is the Android/iOS answer. Folding locators back into the pages would hide the example.
- Four specs and `fullReset` on local Android. One scenario per session is why the cart, validation, and lifecycle tests do not depend on each other.
- Explicit waits on badge, quantity, and exact cents. That is the flakiness answer. Do not add Mocha retries.

**Collapse or stop growing**

- `wdio.local.ts` and `wdio.parallel.ts` differ by `maxInstances` and `androidCapabilities(true)`. `wdio.cloud-android.ts` and `wdio.cloud-ios.ts` differ by the platform argument. One config that switches on `EXECUTION_TARGET` would remove repeated hostname, service, and reporter wiring. Do this only if those files keep drifting; four short files are still easy to open in an interview.
- `LocatorHelper` and `FixtureHelper` are single functions wearing a class. Replacing them is cosmetic. It is not worth a refactor the day before a walkthrough.
- `ApiSetupHelper` and `UnconfiguredApiProvider` do not set up this app. Catalog, cart, and checkout state is on the device. The interface is an honest extension point and a distraction if it is presented as coverage. Leave it, and describe it as unused until a real endpoint exists. Do not add a fake HTTP server to look more complete.
- The ESLint bans in `tests/specs/**` (no `browser`, no locators, no local functions) already enforce the boundary. Further rules will fight the specs without making them clearer.
- Do not add a second abstraction for the shipping alert. The six-line `isAndroid` / `isIOS` branch in `ShippingPage` is the behavioral example. Another strategy interface would make that difference harder to show.

**Walkthrough cut**

Show `purchase.spec.ts`, follow `openCart()` into `navigation.cart`, then show the quantity `waitUntil` in `CartPage.changeQuantity`. Mention scroll and backgrounding as the mobile interactions. Mention Sauce Labs and CI as prepared and not yet executed, unless a run has been recorded by then.
