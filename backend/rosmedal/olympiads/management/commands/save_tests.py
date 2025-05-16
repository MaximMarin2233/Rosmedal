import json

from django.core.management.base import BaseCommand

from olympiads.models import (
    Olympiad,
    OlympiadQuestion,
    OlympiadAnswerOption
)


def save_tests():
    with open('tests.json', 'r') as f:
        tests = json.load(f)

        counter = 0
        for test in tests:
            try:
                olympiad = Olympiad.objects.create(title=test['title'])
                for question in test['questions']:
                    olympiad_question = OlympiadQuestion.objects.create(
                        olympiad=olympiad,
                        question=question['title']
                    )
                    for answer in question['answers']:
                        OlympiadAnswerOption.objects.create(
                            title=answer['title'],
                            is_correct=answer['is_correct'],
                            question=olympiad_question
                        )
                counter += 1
                print(counter)
            except Exception as e:
                print(e)
                print(test)

        



class Command(BaseCommand):

    help = "Parses tests from reference"


    def handle(self, *args, **options):
        save_tests()