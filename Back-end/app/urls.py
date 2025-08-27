from django.urls import path
from .views import *

urlpatterns = [
    # Usuários
    path('usuarios/', UsuarioListCreate.as_view(), name='usuario-list-create'),
    path('usuarios/<int:id_usuario>/', UsuarioRetrieveUpdateDestroy.as_view(), name='usuario-detail'),

    # Tarefas
    path('tarefas/', TarefaListCreate.as_view(), name='tarefa-list-create'),
    path('tarefas/<int:id_tarefa>/', TarefaRetrieveUpdateDestroy.as_view(), name='tarefa-detail'),
]