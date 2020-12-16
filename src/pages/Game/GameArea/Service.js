export const calculateWinner = (squares, oldPosition, rows, cols, condition) => {
    if (!oldPosition) {
        return {
            value: null,
            position: []
        };
    }
    let _a = [];
    const newPosition = [Math.floor(oldPosition / cols), oldPosition % cols]
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            row.push(squares[i * cols + j])
        }
        _a.push(row);
    }

    const WinCodition = condition;
    let count = 1;
    let position = [oldPosition];
    let startI = newPosition[0];
    let startJ = newPosition[1];
    let di = 0;
    let dj = -1;
    const i = newPosition[0];
    const j = newPosition[1];

    while (-1 !== (startJ + dj)) {
        startJ = startJ + dj;
        if (_a[i][j] === _a[i][startJ] && _a[i][startJ] !== null) {
            count++;
            position.push(i * cols + startJ);
        }
        else
            break;
    }

    //Loang qua phải
    startJ = j;
    dj = 1;

    while (cols !== (startJ + dj)) {
        startJ = startJ + dj;
        if (_a[i][j] === _a[i][startJ] && _a[i][startJ] !== null) {
            count++;
            position.push(i * cols + startJ);
        }
        else
            break;
    }


    if (count >= WinCodition) {
        return {
            value: _a[i][j],
            position: position
        };
    }

    position = [oldPosition];
    //Loan theo chiều dọc
    //Loan lên trên
    count = 1;
    startI = i;
    di = -1;

    while (-1 !== (startI + di)) {
        startI = startI + di;
        if (_a[i][j] === _a[startI][j] && _a[startI][j]!== null) {
            count++;
            position.push(startI * cols + j);
        }
        else
            break;
    }

    //Loan xuống dưới
    startI = i;
    di = 1;

    while (rows !== (startI + di)) {
        startI = startI + di;
        if (_a[i][j] === _a[startI][j] && _a[startI][j]!== null) {
            count++;
            position.push(startI * cols + j);
        }
        else
            break;
    }

    if (count >= WinCodition) {
        return {
            value: _a[i][j],
            position: position
        };
    }

    position = [oldPosition];
    //Loang theo đường chéo chính
    //Loang theo trái trên
    count = 1;
    startI = i;
    startJ = j;
    di = -1;
    dj = -1;

    while (-1 !== (startI + di) && -1 !== (startJ + dj)) {
        startI = startI + di;
        startJ = startJ + dj;

        if (_a[i][j] === _a[startI][startJ] && _a[startI][startJ] !== null) {
            count++;
            position.push(startI * cols + startJ);
        }
        else
            break;
    }

    //Loang theo phải dưới
    startI = i;
    startJ = j;
    di = 1;
    dj = 1;

    while (rows !== (startI + di) && cols !== (startJ + dj)) {
        startI = startI + di;
        startJ = startJ + dj;

        if (_a[i][j] === _a[startI][startJ] && _a[startI][startJ] !== null) {
            count++;
            position.push(startI * cols + startJ);
        }
        else
            break;
    }

    if (count >= WinCodition) {
        return {
            value: _a[i][j],
            position: position
        };
    }
    position = [oldPosition];

    //Loang theo đường chéo phụ
    //Loan theo trái dưới
    count = 1;
    startI = i;
    startJ = j;
    di = 1;
    dj = -1;

    while (rows !== (startI + di) && -1 !== (startJ + dj)) {
        startI = startI + di;
        startJ = startJ + dj;

        if (_a[i][j] === _a[startI][startJ] && _a[startI][startJ] !== null) {
            count++;
            position.push(startI * cols + startJ);
        }
        else
            break;
    }

    //Loan theo phải trên
    startI = i;
    startJ = j;
    di = -1;
    dj = 1;

    while (-1 !== (startI + di) && cols !== (startJ + dj)) {
        startI = startI + di;
        startJ = startJ + dj;

        if (_a[i][j] === _a[startI][startJ] && _a[startI][startJ] !== null) {
            count++;
            position.push(startI * cols + startJ);
        }
        else
            break;
    }

    if (count >= WinCodition) {
        return {
            value: _a[i][j],
            position: position
        };
    }

    return {
        value: null,
        position: []
    };
}