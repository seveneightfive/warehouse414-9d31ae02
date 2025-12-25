import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement contact form submission via edge function
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible.",
    });
    
    setName("");
    setEmail("");
    setMessage("");
    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary stripe-border">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-5xl md:text-7xl text-center">CONTACT</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-3xl mb-6">GET IN TOUCH</h2>
              <div className="font-body text-muted-foreground space-y-6">
                <p>
                  Have questions about a piece? Looking for something specific? 
                  We're here to help.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display text-lg text-foreground mb-1">EMAIL</h3>
                    <a href="mailto:hello@warehouse414.com" className="hover:text-foreground transition-colors">
                      hello@warehouse414.com
                    </a>
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-foreground mb-1">RESPONSE TIME</h3>
                    <p>We typically respond within 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="font-body">Name *</Label>
                  <Input
                    id="contact-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="font-body">Email *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="font-body">Message *</Label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="font-body"
                    rows={6}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full font-body uppercase tracking-widest"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
