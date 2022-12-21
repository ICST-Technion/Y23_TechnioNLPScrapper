import pandas as pd
from matplotlib import pyplot as plt
import seaborn as sns
from Graph import Graph


class HistGraph(Graph):
    def set_graph(self):
        df = pd.read_csv(self.file, encoding='Windows-1255')
        fig, _ = plt.subplots(figsize=self.shape)
        sns.barplot(x=df[self.x], y=df[self.y], errorbar=None).set_title(self.title)
