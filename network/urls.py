
from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<str:username>/", views.profile, name='profile'),
    path("createpost", views.create_post, name="createpost"),
    path("post/<int:id>/like", views.like_post, name="likepost"),
    path("post/<int:id>/unlike", views.unlike_post, name="unlikepost"),
    path("<str:username>/follow", views.follow, name="followuser"),
    path("<str:username>/unfollow", views.unfollow, name="unfollowuser"),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

