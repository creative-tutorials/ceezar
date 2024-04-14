import {
  Accordion as BaseAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Props {
  data: {
    title: string;
    description: string;
  }[];
}

export function Accordion({ data }: Props) {
  return (
    <BaseAccordion
      type="single"
      collapsible
      className="w-full border-none flex flex-col gap-5"
    >
      {data.map((item, i) => {
        return (
          <AccordionItem
            value={`item-${i.toFixed()}`}
            key={i}
            className="border bg-[rgb(18,18,32)] border-transparent rounded-md shadow-md transition duration-200 ease-in-out p-4 [&[data-state=open]]:bg-[rgb(15,15,27)]"
          >
            <AccordionTrigger className="text-white md:text-xl lg:text-xl text-base">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="md:text-lg lg:text-lg text-sm text-[#B8BFC6]">
              {item.description}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </BaseAccordion>
  );
}
