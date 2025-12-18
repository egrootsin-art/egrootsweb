// src/pages/Terms.tsx
const Terms = () => (
  <div className="min-h-screen bg-background text-foreground p-6 max-w-4xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>

    <p className="text-sm text-muted-foreground mb-6">
      Last updated: {new Date().toLocaleDateString("en-IN")}
    </p>

    <section className="space-y-4 text-sm">
      <p>
        By accessing or using our website, products, or services, you agree to
        be bound by these Terms & Conditions. If you do not agree with any part
        of these terms, please do not use our services.
      </p>

      <h2 className="font-semibold text-base">1. Use of Services</h2>
      <p>
        You agree to use our services only for lawful purposes and in accordance
        with all applicable laws and regulations. Misuse, unauthorized access,
        or attempts to harm the platform are strictly prohibited.
      </p>

      <h2 className="font-semibold text-base">2. User Accounts</h2>
      <p>
        When you create an account, you are responsible for maintaining the
        confidentiality of your login credentials and for all activities that
        occur under your account.
      </p>

      <h2 className="font-semibold text-base">3. Intellectual Property</h2>
      <p>
        All content, logos, designs, text, graphics, and software are the
        property of the company and are protected by intellectual property
        laws. You may not copy, modify, or distribute any content without prior
        written permission.
      </p>

      <h2 className="font-semibold text-base">4. Payments & Pricing</h2>
      <p>
        All prices are subject to change without notice. Payments must be made
        in full at the time of purchase. We reserve the right to refuse or
        cancel any order at our discretion.
      </p>

      <h2 className="font-semibold text-base">5. Returns & Refunds</h2>
      <p>
        Refund and return policies, if applicable, will be governed by our
        Refund Policy page. Please review it carefully before making a
        purchase.
      </p>

      <h2 className="font-semibold text-base">6. Limitation of Liability</h2>
      <p>
        We shall not be liable for any indirect, incidental, or consequential
        damages arising from the use or inability to use our services.
      </p>

      <h2 className="font-semibold text-base">7. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your access to our services
        at any time, without prior notice, if you violate these terms.
      </p>

      <h2 className="font-semibold text-base">8. Changes to Terms</h2>
      <p>
        We may update these Terms & Conditions from time to time. Continued use
        of our services after changes indicates your acceptance of the updated
        terms.
      </p>

      <h2 className="font-semibold text-base">9. Governing Law</h2>
      <p>
        These terms shall be governed by and interpreted in accordance with the
        laws of India, without regard to conflict of law principles.
      </p>

      <h2 className="font-semibold text-base">10. Contact Us</h2>
      <p>
        If you have any questions about these Terms & Conditions, please contact
        us at support@yourcompany.com.
      </p>
    </section>
  </div>
);

export default Terms;
