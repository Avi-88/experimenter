from django.test import RequestFactory, TestCase
from django.urls import reverse

from experimenter.changelog.views import NimbusChangeLogsView
from experimenter.experiments.tests.factories import (
    NimbusChangeLogFactory,
    NimbusExperimentFactory,
)
from experimenter.openidc.tests.factories import UserFactory


class NimbusChangeLogsViewTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.user = UserFactory.create()
        self.experiment = NimbusExperimentFactory.create(slug="test-experiment")
        self.changelog1 = NimbusChangeLogFactory.create(
            experiment=self.experiment, message="Change log 1"
        )
        self.changelog2 = NimbusChangeLogFactory.create(
            experiment=self.experiment, message="Change log 2"
        )
        self.view = NimbusChangeLogsView.as_view()

    def test_render_to_response(self):
        request = self.factory.get(
            reverse("changelogs-by-slug", kwargs={"slug": self.experiment.slug})
        )
        request.user = self.user
        response = self.view(request, slug=self.experiment.slug)
        self.assertEqual(response.status_code, 200)

    def test_get_context_data(self):
        request = self.factory.get(
            reverse("changelogs-by-slug", kwargs={"slug": self.experiment.slug})
        )
        request.user = self.user
        response = self.view(request, slug=self.experiment.slug)
        context = response.context_data
        self.assertEqual(context["experiment"], self.experiment)

    def test_new_tab_link_rendering(self):
        request = self.factory.get(
            reverse("changelogs-by-slug", kwargs={"slug": self.experiment.slug})
        )
        request.user = self.user
        response = self.view(request, slug=self.experiment.slug)
  
        content = response.render().content

        buttons = [
            {
                "label": "Experimenter Documentation",
                "redirectLink": "https://experimenter.info/",
                "iconClass": "fa-solid fa-book",
            },
            {
                "label": "#ask-experimenter",
                "redirectLink": "https://mozilla.slack.com/?redir=%2Farchives%2FCF94YGE03",
                "iconClass": "fa-brands fa-slack",
            },
            {
                "label": "Feedback",
                "redirectLink": "https://mozilla-hub.atlassian.net/secure/CreateIssueDetails!init.jspa?pid=10203&issuetype=10097",
                "iconClass": "fa-solid fa-message",
            },
            {
                "label": "File targeting criteria request",
                "redirectLink": "https://github.com/mozilla/experimenter/issues/new",
                "iconClass": "fa-brands fa-github",
            },
        ]

        for button in buttons:
            self.assertIn(button["label"].encode(), content)
            self.assertIn(f'href="{button["redirectLink"]}"'.encode(), content)
            self.assertIn(button["iconClass"].encode(), content)



    def test_navigation_button_redirect(self):
        request = self.factory.get(
            reverse("changelogs-by-slug", kwargs={"slug": self.experiment.slug})
        )
        request.user = self.user
        response = self.view(request, slug=self.experiment.slug)

        content = response.render().content

        expected_link = reverse("nimbus-detail", kwargs={"slug": self.experiment.slug})
        self.assertIn(f'href="{expected_link}"'.encode(), content)
