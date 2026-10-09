import { expect } from '@wdio/globals';
import { CatalogPage, ProductDetailsPage, CartPage } from '../../src/pages/index.js';
import { FixtureHelper } from '../../src/helpers/FixtureHelper.js';

describe('Cart quantity', () => {
  it('updates quantity and exact subtotal after increasing and decreasing', async () => {
    const product = FixtureHelper.product();
    const details = new ProductDetailsPage();
    const cart = new CartPage();
    await new CatalogPage().openProduct(product.name);
    await details.addToCart();
    await details.openCart();
    expect(await cart.readItem()).toEqual({ name: product.name, quantity: 1,
      unitPriceCents: product.unitPriceCents, subtotalCents: product.unitPriceCents });
    await cart.changeQuantity(2);
    await cart.waitForSubtotal(product.unitPriceCents * 2);
    expect(await cart.readItem()).toEqual({ name: product.name, quantity: 2,
      unitPriceCents: product.unitPriceCents, subtotalCents: product.unitPriceCents * 2 });
    await cart.changeQuantity(1);
    await cart.waitForSubtotal(product.unitPriceCents);
    expect(await cart.readItem()).toEqual({ name: product.name, quantity: 1,
      unitPriceCents: product.unitPriceCents, subtotalCents: product.unitPriceCents });
  });
});
