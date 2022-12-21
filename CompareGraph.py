import pandas as pd
from matplotlib import pyplot as plt
import seaborn as sns
from Graph import Graph


class CompareGraph(Graph):
    def set_graph(self):
        sns.set_theme(style="ticks")
        df = pd.read_csv(self.file,encoding='Windows-1255')
        fig, ax = plt.subplots(figsize=self.shape)
        sns.despine(fig)
        df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m-%d')
        sns.histplot(
            df,
            x=self.x, hue=self.y,
            multiple="stack",
            palette="light:m_r",
            edgecolor=".3",
            linewidth=.5,
        )
