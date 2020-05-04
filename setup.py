import setuptools

setuptools.setup(
    name="food-logger",
    version="0.0.1",
    author="Aman Kapur",
    author_email="amankapur91@gmail.com",
    description="A simple food logging app",
    url="https://github.com/amankapur/food-logger",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)
