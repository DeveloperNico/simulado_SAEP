from django.db import models

class Usuario(models.Model): 
    id_usuario = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.nome
    
class Tarefa(models.Model):
    PRIORIDADE_CHOICES = [
        ('Baixa', 'Baixa'),
        ('Média', 'Média'),
        ('Alta', 'Alta'),
    ]

    STATUS_CHOICES = [
        ('a fazer', 'A Fazer'),
        ('fazendo', 'Fazendo'),
        ('pronto', 'Pronto'),
    ]

    id_tarefa = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=255)
    nome_setor = models.CharField(max_length=100)
    prioridade = models.CharField(max_length=10, choices=PRIORIDADE_CHOICES)
    data_cadastro = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='a fazer')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='tarefas')

    def __str__(self):
        return self.descricao