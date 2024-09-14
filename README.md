# AR Earthquakes

- [DEMO](https://code4fukui.github.io/ar-earthquakes)

## reference

- Earth:  <a href=https://github.com/martynafford/natural-earth-geojson/blob/master/110m/physical/ne_110m_coastline.json>ne_110m_coastline.json</a> ← <a href=https://github.com/martynafford/natural-earth-geojson/tree/master>Natural Earth data in GeoJSON</a>
- 衛星軌道データ: [NORAD GP Element Sets Current Data](http://celestrak.org/NORAD/elements/gp.php?GROUP=gnss&FORMAT=tle)

## dependencies

- LIB: <a href="https://github.com/code4fukui/egxr.js/">egxr.js</a>

## 回転について
$$
軌道系射角を\theta_1\\
昇交点の赤経を\theta_2\\
$$
とする

$$
\begin{bmatrix}
x' \\
y' \\
z' 
\end{bmatrix}

=

\begin{bmatrix}
1 & 0 & 0 \\
0 & \cos \theta_1 & -\sin \theta_1 \\
0 & \sin \theta_1 & \cos \theta_1
\end{bmatrix}

\begin{bmatrix}
\cos \theta_2 & -\sin \theta_2 & 0 \\
\sin \theta_2 & \cos \theta_2 & 0 \\
0 & 0 & 1
\end{bmatrix}

\begin{bmatrix}
x \\
y \\
z 
\end{bmatrix}
$$

行列の積の計算においてABC=(AB)Cのため、回転行列同士の積は先に計算しても問題ない。
$$
\begin{bmatrix}
1 & 0 & 0 \\
0 & \cos \theta_1 & -\sin \theta_1 \\
0 & \sin \theta_1 & \cos \theta_1
\end{bmatrix}

\begin{bmatrix}
\cos \theta_2 & -\sin \theta_2 & 0 \\
\sin \theta_2 & \cos \theta_2 & 0 \\
0 & 0 & 1
\end{bmatrix}

=

\begin{bmatrix}
\cos \theta_2 & -\sin \theta_2 & 0 \\
\cos \theta_1 \sin \theta_1 & \cos \theta_1 \cos \theta_2 & -\sin \theta_1 \\
\sin \theta_1 \sin \theta_1 & \sin \theta_1 \cos \theta_2 & -\cos \theta_1
\end{bmatrix}
$$

$$
\begin{bmatrix}
x' \\
y' \\
z' 
\end{bmatrix}

=

\begin{bmatrix}
\cos \theta_2 & -\sin \theta_2 & 0 \\
\cos \theta_1 \sin \theta_1 & \cos \theta_1 \cos \theta_2 & -\sin \theta_1 \\
\sin \theta_1 \sin \theta_1 & \sin \theta_1 \cos \theta_2 & -\cos \theta_1
\end{bmatrix}

\begin{bmatrix}
x \\
y \\
z 
\end{bmatrix}

\\ 

=

\begin{bmatrix}
x \cos \theta_2 - y \sin \theta_2 \\
x \cos \theta_1 \sin \theta_2 + y \cos \theta_1 \cos \theta_2 - z \sin \theta_1 \\
x \sin \theta_1 \sin \theta_2 + y \sin \theta_1 \cos \theta_2 + z \cos \theta_1
\end{bmatrix}
$$

とりあえずzは基準面上（z=0）なので
$$
\begin{bmatrix}
x' \\
y' \\
z' 
\end{bmatrix}

=

\begin{bmatrix}
\cos \theta_2 & -\sin \theta_2 & 0 \\
\cos \theta_1 \sin \theta_1 & \cos \theta_1 \cos \theta_2 & -\sin \theta_1 \\
\sin \theta_1 \sin \theta_1 & \sin \theta_1 \cos \theta_2 & -\cos \theta_1
\end{bmatrix}

\begin{bmatrix}
x \\
y \\
0
\end{bmatrix}

\\ 

=

\begin{bmatrix}
x \cos \theta_2 - y \sin \theta_2 \\
x \cos \theta_1 \sin \theta_2 + y \cos \theta_1 \cos \theta_2 \\
x \sin \theta_1 \sin \theta_2 + y \sin \theta_1 \cos \theta_2 
\end{bmatrix}
$$

よって、
$$
x' = x \cos \theta_2 - y \sin \theta_2 \\
y' = x \cos \theta_1 \sin \theta_2 + y \cos \theta_1 \cos \theta_2 \\
x' = x \sin \theta_1 \sin \theta_2 + y \sin \theta_1 \cos \theta_2 
$$
となる