import scrapy


class GlossarySpider(scrapy.Spider):
    name = "glossary"

    def start_requests(self):
        urls = [
            'http://math.hws.edu/graphicsbook/glossary.html'
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        for glossary in response.css('p.glossary_item'):
          yield{
            'term': glossary.css('span.glossary_term::text').extract_first()[:-1],
            'definition': glossary.css('span.glossary_definition::text').extract_first(),
          }
        