class Pollyfill {
    public static anyExists<T>(array: T[], predicate: (value: T) => boolean): boolean {
        for (const value of array) {
            if (predicate(value)) {
                return true;
            }
        }

        return false;
    }
}

export default Pollyfill;