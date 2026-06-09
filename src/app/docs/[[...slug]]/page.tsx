import { source } from "@/lib/source";
import { DocsBody, DocsPage, DocsTitle, DocsDescription } from "fumadocs-ui/page";
import { Card, Cards } from "fumadocs-ui/components/card";
import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DocTOCHeader } from "../DocTOCHeader";
import { DocTOCFooter } from "../DocTOCFooter";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage 
      toc={page.data.toc} 
      full={page.data.full}
      tableOfContent={{
        header: <DocTOCHeader />,
        footer: <DocTOCFooter lastUpdated={page.data.lastUpdated} />
      }}
      tableOfContentPopover={{
        header: <DocTOCHeader />,
        footer: <DocTOCFooter lastUpdated={page.data.lastUpdated} />
      }}
    >
      <DocsBody>
        <MDX components={{ Card, Cards, Callout, Tab, Tabs, Step, Steps }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) return {};

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
