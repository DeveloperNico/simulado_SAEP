from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Usuario, Tarefa
from .serializers import UsuarioSerializer, TarefaSerializer

class UsuarioListCreate(ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class UsuarioRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    lookup_field = 'id_usuario'

class TarefaListCreate(ListCreateAPIView):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer

class TarefaRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer
    lookup_field = 'id_tarefa'