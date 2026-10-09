import { expect } from '@wdio/globals';
import { CatalogPage, ProductDetailsPage, CartPage, LoginPage, ShippingPage, PaymentPage, ReviewPage, ConfirmationPage } from '../../src/pages/index.js';
import { FixtureHelper } from '../../src/helpers/FixtureHelper.js';
import { credentials, shippingDetails, paymentDetails, deliveryCents } from '../../src/data/fixtures.js';

describe('Purchase', () => {
  it('completes a purchase with the expected product and total', async () => {
    const product = FixtureHelper.product();
    const catalog = new CatalogPage();
    const details = new ProductDetailsPage();
    const cart = new CartPage();
    const shipping = new ShippingPage();
    const payment = new PaymentPage();
    const review = new ReviewPage();

    await catalog.openProduct(product.name);
    await details.addToCart();
    await details.openCart();
    expect(await cart.readItem()).toEqual({ name: product.name, quantity: 1,
      unitPriceCents: product.unitPriceCents, subtotalCents: product.unitPriceCents });
    await cart.proceedToCheckout();
    await new LoginPage().signIn(credentials);
    await shipping.fillAddress(shippingDetails);
    await shipping.submitShipping();
    await payment.enterPayment(paymentDetails);
    await payment.reviewOrder();
    expect(await review.readOrder()).toEqual({ name: product.name, quantity: 1,
      unitPriceCents: product.unitPriceCents, totalCents: product.unitPriceCents + deliveryCents });
    await review.placeOrder();
    expect(await new ConfirmationPage().readHeading()).toBe('Checkout Complete');
  });
});
