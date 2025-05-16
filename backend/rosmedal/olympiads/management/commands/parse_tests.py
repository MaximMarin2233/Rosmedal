import requests
import json
from bs4 import BeautifulSoup

from django.core.management.base import BaseCommand


parse_routes = [
        'https://solncesvet.ru/test/test_load/',
        'https://solncesvet.ru/kptest/test_load_kpk/',
    ]


def parse_tests():
    
    tests = []
    count_of_parsed_tests = 0


    for route in parse_routes:
        for i in range(5000):
            try:
                route_with_id = route + str(i)
                r = requests.get(route_with_id)
                soup = BeautifulSoup(r.text, 'html.parser')

                test_main_block = soup.find('div', {'class': 'test_main'})
                test_title = soup.find('h2').text
                test_questions_blocks = test_main_block.findAll('div', {'class': 'q_cont'})

                questions = []
                for question_block in test_questions_blocks:
                    question_title = question_block.find('h5').text
                    question_answers_blocks = question_block.findAll('div', {'class': 'a_option'})

                    answers = []
                    for answer_block in question_answers_blocks:
                        answer_title = answer_block.text
                        is_correct = bool(int(answer_block.find('input').get('data-a')))
                        answers.append(
                            {'title': answer_title,
                            'is_correct': is_correct}
                        )
                    questions.append(
                        {'title': question_title,
                        'answers': answers}
                    )
                tests.append(
                    {'title': test_title,
                    'questions': questions}
                )
                count_of_parsed_tests += 1
                print(count_of_parsed_tests)
            except Exception as e:
                print(e)
                print(route_with_id)
            
            
    
            
    with open('tests.json', 'w') as f:
        json.dump(tests, f, ensure_ascii=False)
        


class Command(BaseCommand):

    help = "Parses tests from reference"


    def handle(self, *args, **options):
        parse_tests()