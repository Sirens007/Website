---
title: Java对象比较方式：equals、Comparable与Comparator
published: 2026-04-14
pinned: false
description: "通过示例分析 Java 对象比较的三种实现方式，包括 equals 重写、自然排序与自定义比较器."
image: ./d8.png
tags: ["数据结构", "Java"]
category: 开发
draft: false
---

我们就拿这个来举例：

```java
public class Card{
    public String suit;
    public int rank;

    public Card(String suit,int rank) {
        this.suit = suit;
        this.rank = rank;
    }
    
    public static void main(String[] args) {
        Card card1 = new Card("hongtao", 5);
        Card card2 = new Card("heitao", 5);
}
```

## 1.覆写基类的 equals
当我们要判断**两张牌是否相同**时，需要比较的内容是 **suit 以及 rank 两个属性**。

因此在比较是否相同上，我们通常用`==`进行比较，而在两个实例化的 card 中，则使用 `euqals`方法。

```java
public class Card {
    public String suit;
    public int rank;

    public Card(String suit,int rank) {
        this.suit = suit;
        this.rank = rank;
    }
    // 比较牌面、花色是否相同
    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Card card = (Card) o;
        return rank == card.rank && Objects.equals(suit, card.suit);
    }

    @Override
    public int hashCode() {
        return Objects.hash(suit, rank);
    }
}
```

**重写 equals、hashCode 方法**

在 IDEA 上，可以使用快捷键`Alt+Ins`，找到 `equals 和 hashCode`默认下一步即可

## 2.基于 Comparable 接口类的比较
对用用户自定义类型，如果要想按照大小与方式进行比较时：在定义类时，实现`Comparable`接口即可，然后在类中**重写**`compareTo`**方法**。

```java
public class Card implements Comparable<Card> {
    public String suit;
    public int rank;

    public Card(String suit,int rank) {
        this.suit = suit;
        this.rank = rank;
    }
    // 大小比较
    @Override
    public int compareTo(Card o) {
        return this.rank - o.rank;
    }
}
```

因此我们在只**比较牌面大小**的时候，可以通过**重写**`compareTo`方法即可。

其 return 有两种写法

```java
return this.rank - o.rank;
return Integer.compare(this.rank, o.rank);  //  更安全
```

该方法的返回值含义有以下：

```java
public interface Comparable<E> {
// 返回值:
// < 0: 表示 this 指向的对象小于 o 指向的对象
// == 0: 表示 this 指向的对象等于 o 指向的对象
// > 0: 表示 this 指向的对象大于 o 指向的对象
int compareTo(E o);
}
```

## 3.基于比较器比较
当用户**自定义比较器**的时候，实现这个接口并**重写 compare 方法**

例如，在该例子中我想**比较花色**，我们可以在 Card 类之外再**创建一个类去实现该接口**。减少对类的嵌入

`comapre 方法`内如何比较可自定义

```java
class SuitComparator implements Comparator<Card> {
    public int compare(Card o1,Card o2) {
        return o1.suit.compareTo(o2.suit);
    }
}
```

**注意**：Comparator 是 java.util 包中的泛型接口类，使用时必须导入对应的包。

该比较器的方法返回值如下：

```java
public interface Comparator<T> {
// 返回值:
// < 0: 表示 o1 指向的对象小于 o2 指向的对象
// == 0: 表示 o1 指向的对象等于 o2 指向的对象
// > 0: 表示 o1 指向的对象等于 o2 指向的对象
int compare(T o1, T o2);
}
```

## 三种方式的对比
| **<font style="color:rgb(31, 31, 31);">特性</font>**     | **<font style="color:rgb(31, 31, 31);">Object.equals</font>** | **<font style="color:rgb(31, 31, 31);">Comparable</font>**   | **<font style="color:rgb(31, 31, 31);">Comparator</font>**   |
| -------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **<font style="color:rgb(31, 31, 31);">比较目的</font>** | <font style="color:rgb(31, 31, 31);">判断相等</font>         | <font style="color:rgb(31, 31, 31);">定义默认顺序</font>     | <font style="color:rgb(31, 31, 31);">定义多种/临时顺序</font> |
| **<font style="color:rgb(31, 31, 31);">比较结果</font>** | <font style="color:rgb(31, 31, 31);">boolean</font>          | <font style="color:rgb(31, 31, 31);">int (负, 0, 正)</font>  | <font style="color:rgb(31, 31, 31);">int (负, 0, 正)</font>  |
| **<font style="color:rgb(31, 31, 31);">修改位置</font>** | <font style="color:rgb(31, 31, 31);">类内部</font>           | <font style="color:rgb(31, 31, 31);">类内部（实现接口）</font> | <font style="color:rgb(31, 31, 31);">类外部（独立比较器）</font> |
| **<font style="color:rgb(31, 31, 31);">灵活性</font>**   | <font style="color:rgb(31, 31, 31);">低</font>               | <font style="color:rgb(31, 31, 31);">中（一种规则固定）</font> | <font style="color:rgb(31, 31, 31);">高（多种规则切换）</font> |
| **<font style="color:rgb(31, 31, 31);">典型方法</font>** | `a.equals(b)`                                                | `a.compareTo(b)`                                             | `c.compare(a, b)`                                            |



