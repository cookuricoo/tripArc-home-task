# Native 2.3.0 source audit

Selectors were derived from the official release-tag sources:

- [Android 2.3.0](https://github.com/saucelabs/my-demo-app-android/tree/2.3.0)
- [iOS 2.3.0](https://github.com/saucelabs/my-demo-app-ios/tree/2.3.0)

Android XML layouts expose stable resource IDs. iOS storyboards expose several accessibility IDs but leave form fields, cart row values, and review values unidentified. Source inspection does not prove the runtime accessibility tree matches the storyboard hierarchy.

| Screen | Android source/strategy | iOS source/strategy |
| --- | --- | --- |
| Catalog | `fragment_product_catalog.xml`, `title` accessibility label; XPath anchors the product image to its named sibling because only the image has a click listener | `TabBar.storyboard`, `Catalog-screen`; product labels assigned in `CatalogViewController.swift` |
| Product | `fragment_product_detail.xml`, `cartBt`, `cartTV` | `ProductDetails-screen`, `AddToCart`; cart badge has no ID |
| Cart | `item_my_cart.xml`, `titleTV`, `priceTV`, `noTV`, plus/minus IDs; `totalPriceTV` | `ProceedToCheckout`; scoped first-cell XPath for product/price/quantity, image-derived button labels, footer XPath |
| Login | `nameET`, `passwordET`, `loginBtn` | Text field/secure field class chains, Login button predicate |
| Shipping | `fragment_checkout_info.xml`, input IDs and `fullNameErrorTV` | Placeholder predicates from `TabBar.storyboard`; validation alert text from `ShippingAddressViewController.swift` |
| Payment | `fragment_checkout.xml`, input IDs and `paymentBtn` | Placeholder predicates and Review Order button title |
| Review | `fragment_place_order.xml`, title/price/total IDs | Scoped first table-cell values, footer anchored to Total, Place Order button |
| Confirmation | `completeTV` | Static text Checkout Complete |

The scoped first-cell selectors intentionally match the one-product test strategy. Before adding multiple products, resolve each row by expected product identity. iOS placeholder selectors are used only when filling an initially empty field; they must be replaced by a stable row/field strategy before supporting edits of already-filled fields.

Source-backed product fixture differences are deliberate: Android seeds `Sauce Labs Backpack` for $29.99; iOS's English `BackPackNameBlack` is `Sauce Labs Backpack - Black` for $29.99. Both review controllers add $5.99 delivery. English locale is fixed in capabilities.

Runtime verification status and actual locator corrections belong in `validation.md`.
