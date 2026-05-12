from enum import Enum, Flag

class ProjectRights(int, Flag):
    READ = 1
    WRITE = 2
    DELETE = 4
    MANAGE = 8
    ADMIN = 16