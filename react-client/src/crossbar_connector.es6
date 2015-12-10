var session, subscriptions;

session = null;
subscriptions = {};

// NOTE: Why is this state here instead of inside of Redux?
// Unfortunately, we can't really get an immutable copy of anything related to autobahn, because autobahn uses
// mutable objects as the heart and soul of the library.  These can't be serialized or reused, so we'll have to
// manage their state separately, even though it's kind of messy.

// TODO: this module should probably be a lot more fault-tolerant overall
export function registerSession(_session) {
    session = _session;
}

export function getSession() {
    return session;
}

export function registerSubscription(name, subscription) {
    subscriptions[name] = subscription;
}

export function getSubscription(name) {
    return subscriptions[name];
}

export function unregisterSubscription(name) {
    delete subscriptions[name];
}
