# toy stock market ui

Super crude web interface for the [toy-stop-market](https://github.com/JosePedroDias/toy-stock-market) project.

Assumes the core is running on port 3030 on the same machine as UI.

## install

    npm install

## run

    npm start

## TODO

* list transactions
* display stream events in the UI
* optionally display individual bids/asks insteaed of LOB (requires new endpoint on TSM)
* a more summarized view of all stocks?
* graph over time (requires aggregation of data, needs thinking first)
