import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns


class Histogram:
    def __init__(self, file, x_axis, y_axis):
        self.file = file
        self.x = x_axis
        self.y = y_axis
        self.set_histogram()

    def set_histogram(self):
        df = pd.read_csv(self.file)
        sns.barplot(x=df[self.x], y=df[self.y])

    def get_histogram(self):
        plt.show()
