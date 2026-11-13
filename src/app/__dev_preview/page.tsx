import WithBg from "@/slices/HeroSection/variants/withBg";

const slice = {
  slice_type: "hero_section",
  slice_label: null,
  id: "preview",
  variation: "withBackgroundImage",
  version: "initial",
  primary: {
    top_padding: "Half",
    bottom_padding: "Full",
    eyebrow: [
      {
        type: "paragraph",
        text: "Global Learning Lab",
        spans: [],
      },
    ],
    title: [
      {
        type: "paragraph",
        text: "Developing Leaders for a Sustainable World.",
        spans: [],
      },
    ],
    description: [
      {
        type: "paragraph",
        text: "Every child is also a leader. We build the ecosystem to prove it.",
        spans: [],
      },
    ],
    buttons: [
      {
        link_type: "Web",
        url: "https://prismic.io",
        text: "Button Text",
        variant: "Primary",
      },
      {
        link_type: "Web",
        url: "https://prismic.io",
        text: "Button Text",
        variant: "Secondary",
      },
    ],
    image: {
      id: "main",
      url: "https://images.unsplash.com/photo-1600861194802-a2b11076bc51?rect=0%2C557%2C2545%2C1432&w=1920&h=1080",
      dimensions: { width: 1920, height: 1080 },
      alt: "fair",
      copyright: null,
    },
  },
  items: [],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

export default function DevPreview() {
  return <WithBg slice={slice} />;
}
