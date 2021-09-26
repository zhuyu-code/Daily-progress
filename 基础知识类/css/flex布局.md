## 容器属性

### flex-direction

```
 row（默认值）：主轴为水平方向，起点在左端。
 row-reverse：主轴为水平方向，起点在右端。
 column：主轴为垂直方向，起点在上沿。
 column-reverse：主轴为垂直方向，起点在下沿。
```

### flex-wrap

```
nowrap:不换行
wrap:换行，第一行在上方，也就是上方第一行满了后，直接从左到右排第二行。
wrap-reverse:换行，满的一行在下方

```

### flex-flow

flex-direction 和 flex-wrap 属性的缩写

```
  flex-flow: <flex-direction> || <flex-wrap>;
```

### justify-content

```
flex-start（默认值）：左对齐
flex-end：右对齐
center： 居中
space-between：两端对齐，项目之间的间隔都相等。
space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。
```

### align-items

```
flex-start：交叉轴的起点对齐。
flex-end：交叉轴的终点对齐。
center：交叉轴的中点对齐。
baseline: 项目的第一行文字的基线对齐。
stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。
```

### align-content

align-content 属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

```
flex-start：与交叉轴的起点对齐。
flex-end：与交叉轴的终点对齐。
center：与交叉轴的中点对齐。
space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
stretch（默认值）：轴线占满整个交叉轴。
```

## 项目属性

### order

项目的排列顺序

### flex-grow

flex-grow 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。

```
flex-grow:1,2或者其他属性每一个代表宽度比例，也就是除了flex默认的0的情况下，其他的部分按照比列放大
```

### flex-shrink

flex-shrink 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。

```
flex-shrink:1(默认)，设置为0，也就是剩余空间不足，flex-shrink为1的也不缩小
```

### flex-basis

flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 auto，即项目的本来大小。

### flex

后面两个可选

```
flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
```

### align-self

除了 auto 都和 align-items 一样属性值，auto 表示继承 align-items,align-self 优先级大于 align-self.

```
 align-self: auto | flex-start | flex-end | center | baseline | stretch;
```
