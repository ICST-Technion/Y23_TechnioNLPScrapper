import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns


class Graph:
    """
    This class represents a graph object, which will be embedded in our UI later on
    In this example, we read the data from a csv file, but it can also be other files,
    such as csv, excel or SQL.
    """
    def __init__(self, file, x_axis, y_axis, title, figure_shape=(10, 7)):
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

    def set_graph(self):
        df = pd.read_csv(self.file)
        fig, ax = plt.subplots(figsize=self.shape)
        if self.x == "Date":
            df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m-%d')
            sns.lineplot(ax=ax, x=df[self.x], y=df[self.y], data=df)
        else:
            sns.barplot(x=df[self.x], y=df[self.y]).set_title(self.title)

    def get_graph(self):
        plt.show()
