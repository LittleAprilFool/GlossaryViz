import scrapy


class ChapterSpider(scrapy.Spider):
    name = "chapter"

    def start_requests(self):
        urls = [
            'http://math.hws.edu/graphicsbook/index.html'
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        for chapter in response.css('ul.contents li'):
            id = chapter.css('li::text').extract_first()
            if id[0]!='C': 
                continue
            chapterName = chapter.css('b a::text').extract_first()
            chapterUrl = chapter.css('b a::attr(href)').extract_first() 
            yield response.follow(chapterUrl, callback = self.parseChapter)
    
    def parseChapter(self, response):
        chapterId = response.css('h3.chapter_title::text').extract_first()
        chapterTitle = response.css('h2.chapter_title::text').extract_first() 
        yield{
            'chapter_id': chapterId,
            'chapter_title': chapterTitle,
            'section_id': '0',
            'section_title': 'null',
            'content': response.css('p::text').extract(),
        }
        for section in response.css('ul.contents li'):
            sectionUrl = section.css('a::attr(href)').extract_first()
        yield response.follow(sectionUrl, callback = lambda r: self.parseSection(r, chapterId, chapterTitle))

    def parseSection(self, response, chapterId, chapterTitle):
        yield{
            'chapter_id': chapterId,
            'chapter_title': chapterTitle,
            'section_id': response.css('h3.section_title::text').extract_first(),
            'section_title': response.css('h2.section_title::text').extract_first(),
            'content': response.css('p::text').extract(),
        }
        