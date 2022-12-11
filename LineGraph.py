import pandas as pd
from matplotlib import pyplot as plt
import seaborn as sns
from Graph import Graph


class LineGraph(Graph):
    def set_graph(self):
        df = pd.read_csv(self.file)
        fig, ax = plt.subplots(figsize=self.shape)
        df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m-%d')
        sns.lineplot(ax=ax, x=df[self.x], y=df[self.y], data=df).set(title=self.title)