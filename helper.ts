function integerPartitions(n: number): number[][] {
    const result: number[][] = [];

    function helper(target: number, max: number, prefix: number[]) {
        if (target === 0) {
            result.push(prefix);
            return;
        }

        for (let i = Math.min(max, target); i >= 1; i--) {
            helper(target - i, i, [...prefix, i]);
        }
    }

    helper(n, n, []);
    return result;
}

function distinctPermutations(arr: number[]): number[][] {
    const results: number[][] = [];
    const used = Array(arr.length).fill(false);
    arr.sort((a, b) => a - b); // sort for duplicate handling

    function backtrack(path: number[]) {
        if (path.length === arr.length) {
            results.push([...path]);
            return;
        }

        for (let i = 0; i < arr.length; i++) {
            if (used[i]) continue;
            if (i > 0 && arr[i] === arr[i - 1] && !used[i - 1]) continue; // skip duplicates
            used[i] = true;
            path.push(arr[i]);
            backtrack(path);
            path.pop();
            used[i] = false;
        }
    }

    backtrack([]);
    return results;
}

function integerPartitionPerms(n: number): number[][] {
    const partitions = integerPartitions(n);
    const perms: number[][] = [];

    for (const partition of partitions) {
        const distinctPerms = distinctPermutations(partition);
        perms.push(...distinctPerms);
    }

    return perms;
}

const distPerms_ = {
    1: integerPartitionPerms(1),
    2: integerPartitionPerms(2),
    3: integerPartitionPerms(3),
    4: integerPartitionPerms(4),
    5: integerPartitionPerms(5),
    6: integerPartitionPerms(6),
    7: integerPartitionPerms(7),
    8: integerPartitionPerms(8),
}

//console.log(distPerms_);

export const distPerms = distPerms_;
