from abc import abstractmethod

import matplotlib.pyplot as plt


class Graph:
    """
    This class represents a graph object, which will be embedded in our UI later on
    In this example, we read the data from a csv file, but it can also be other files,
    such as csv, excel or SQL.
    """

    def __init__(self, file, x_axis, y_axis, title="", figure_shape=(10, 7)):
        """
        :param file: the file we read the table from, currently a csv file, string
        :param x_axis: the field which will serve as the x axis to the graph,string
        :param y_axis: the field which will serve as the y axis to the graph,string
        :param title: the title of the graph at the top of the page,string
        :param figure_shape: the dimensions of the graph, tuple (height,width)
        """
        self.file = file
        self.x = x_axis
        self.y = y_axis
        self.title = title
        self.shape = figure_shape
        self.set_graph()

    @abstractmethod
    def set_graph(self):
        raise NotImplementedError('call to abstract method ')

    def get_graph(self):
        plt.show()
